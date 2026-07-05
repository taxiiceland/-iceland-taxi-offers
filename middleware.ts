import { NextRequest, NextResponse } from "next/server";

const adminSessionCookie = "ito_admin_session";

function safeCompare(left: string, right: string) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}

function unauthorized() {
  const response = new NextResponse(null, {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Iceland Taxi Offers Admin", charset="UTF-8"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Vary: "Authorization, Cookie"
    }
  });

  response.cookies.set(adminSessionCookie, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: true
  });

  return response;
}

async function createAdminSessionToken(username: string, password: string) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`${username}:${password}`)
  );

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getBasicCredentials(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return "invalid";
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return "invalid";
  }
}

async function adminCredentialsAreValid(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return "missing-config";
  }

  const sessionToken = await createAdminSessionToken(username, password);
  const basicCredentials = getBasicCredentials(request);

  if (basicCredentials === "invalid") {
    return false;
  }

  if (basicCredentials) {
    return (
      safeCompare(basicCredentials.username, username) &&
      safeCompare(basicCredentials.password, password) &&
      "basic"
    );
  }

  const cookieToken = request.cookies.get(adminSessionCookie)?.value;

  if (cookieToken && safeCompare(cookieToken, sessionToken)) {
    return "cookie";
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const credentialsValid = await adminCredentialsAreValid(request);

  if (credentialsValid === "missing-config") {
    return new NextResponse(
      "Admin credentials are not configured. Add ADMIN_USERNAME and ADMIN_PASSWORD in Vercel Environment Variables.",
      { status: 503 }
    );
  }

  if (!credentialsValid) {
    return unauthorized();
  }

  const response = NextResponse.next();

  if (credentialsValid === "basic") {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (username && password) {
      response.cookies.set(
        adminSessionCookie,
        await createAdminSessionToken(username, password),
        {
          httpOnly: true,
          maxAge: 60 * 60 * 8,
          path: "/",
          sameSite: "lax",
          secure: true
        }
      );
    }
  }

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Vary", "Authorization, Cookie");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
