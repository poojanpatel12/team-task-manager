import { NextRequest, NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/schemas';

// In-memory store (replace with DB in production)
const enquiries: unknown[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const entry = { ...parsed.data, id: Date.now(), createdAt: new Date().toISOString() };
    enquiries.push(entry);

    return NextResponse.json({ message: 'Enquiry submitted successfully' }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(enquiries);
}
