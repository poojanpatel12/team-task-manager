import { NextRequest, NextResponse } from 'next/server';

export interface Member {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  department: string;
  avatar: string;
  joinedAt: string;
}

const members: Member[] = [
  { id: 1, name: 'Poojan Shah', email: 'poojan@company.com', role: 'admin', department: 'Engineering', avatar: 'PS', joinedAt: '2024-01-10' },
  { id: 2, name: 'Ritu Mehta', email: 'ritu@company.com', role: 'member', department: 'Design', avatar: 'RM', joinedAt: '2024-02-15' },
  { id: 3, name: 'Arjun Patel', email: 'arjun@company.com', role: 'member', department: 'Product', avatar: 'AP', joinedAt: '2024-03-20' },
  { id: 4, name: 'Sneha Joshi', email: 'sneha@company.com', role: 'admin', department: 'Engineering', avatar: 'SJ', joinedAt: '2024-01-05' },
  { id: 5, name: 'Dev Trivedi', email: 'dev@company.com', role: 'member', department: 'Marketing', avatar: 'DT', joinedAt: '2024-04-01' },
];

export async function GET() {
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const { name, email, role, department } = await req.json();
  if (!name || !email || !role || !department)
    return NextResponse.json({ message: 'All fields required' }, { status: 400 });

  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const member: Member = { id: Date.now(), name, email, role, department, avatar: initials, joinedAt: new Date().toISOString().split('T')[0] };
  members.push(member);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  members.splice(idx, 1);
  return NextResponse.json({ message: 'Deleted' });
}
