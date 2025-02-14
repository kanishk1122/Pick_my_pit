import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Breed from "../../../models/Breed";

export async function GET() {
  await dbConnect();
  const breeds = await Breed.find({}).sort({ index: 1 });
  return NextResponse.json(breeds);
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    console.log("Received breed data:", body);

    // Validate required fields
    if (!body.name || !body.species) {
      return NextResponse.json(
        { error: "Name and species are required fields" },
        { status: 400 }
      );
    }

    const breed = await Breed.create(body);
    console.log("Created breed:", breed);
    return NextResponse.json(breed, { status: 201 });
  } catch (error) {
    console.error("Error creating breed:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
