import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const signup = async (body: { username: string; email: string; password: string; role?: 'admin' | 'member' }) => {
  const { username, email, password, role } = body;

  if (await User.findOne({ email })) throw new Error('Email already in use');
  if (await User.findOne({ username })) throw new Error('Username already taken');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed, role: role || 'member' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

export const login = async (body: { email: string; password: string }) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};
