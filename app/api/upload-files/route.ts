import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { readFile } from "fs/promises";
import { getUser } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    let combinedCode = "";

    if (user.tier === 'pro') {
      // Handle multiple files for pro users
      const files = formData.getAll("files[]");
      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: "No files provided" },
          { status: 400 }
        );
      }

      // Process each file
      for (const file of files) {
        if (file instanceof File) {
          const buffer = await file.arrayBuffer();
          const code = new TextDecoder().decode(buffer);
          combinedCode += `\n\n// File: ${file.name}\n${code}`;
        }
      }
    } else {
      // Handle single file for free users
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      combinedCode = new TextDecoder().decode(buffer);
    }

    return NextResponse.json({ code: combinedCode });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
} 