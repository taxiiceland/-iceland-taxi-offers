import { NextRequest, NextResponse } from "next/server";

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
  return new NextResponse(null, {
    status: 401,
    headers: {
      "WWW-Authenticate":
        'Basic realm="Iceland Taxi Offers Admin", charset="UTF-8"',
      "Cache-Control": "no-store, no-cache, must-revalidate"
    }
  });
}

function adminCredentialsAreValid(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return "missing-config";
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const suppliedUsername = decoded.slice(0, separatorIndex);
    const suppliedPassword = decoded.slice(separatorIndex + 1);

    return (
      safeCompare(suppliedUsername, username) &&
      safeCompare(suppliedPassword, password)
    );
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const credentialsValid = adminCredentialsAreValid(request);

  if (credentialsValid === "missing-config") {
    return new NextResponse(
      "Admin credentials are not configured. Add ADMIN_USERNAME and ADMIN_PASSWORD in Vercel Environment Variables.",
      { status: 503 }
    );
  }

  if (!credentialsValid) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
