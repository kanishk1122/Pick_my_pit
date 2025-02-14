import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Breed from '../../../../models/Breed';

export async function GET(request, { params }) {
  await dbConnect();
  const breed = await Breed.findById(params.id);
  if (!breed) {
    return NextResponse.json({ error: 'Breed not found' }, { status: 404 });
  }
  return NextResponse.json(breed);
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();
    const breed = await Breed.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!breed) {
      return NextResponse.json({ error: 'Breed not found' }, { status: 404 });
    }
    return NextResponse.json(breed);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const breed = await Breed.findByIdAndDelete(params.id);
  if (!breed) {
    return NextResponse.json({ error: 'Breed not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Breed deleted successfully' });
}
