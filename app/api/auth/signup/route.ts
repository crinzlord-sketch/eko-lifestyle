import { randomUUID } from "crypto";
import { pool } from "@/lib/db";
import crypto from "crypto";
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.username || !b.email || !b.password || Number(b.age) < 18) return Response.json({error:"Invalid account details."},{status:400});
    if (b.password.length < 8) return Response.json({error:"Password must be at least 8 characters."},{status:400});
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(b.password, salt, 64).toString("hex");
    const id = randomUUID();
    await pool.query("INSERT INTO users(id,username,email,password_hash,age) VALUES($1,$2,$3,$4,$5)",[id,b.username,b.email.toLowerCase(),salt+":"+hash,Number(b.age)]);
    return Response.json({userId:id});
  } catch (e:any) { return Response.json({error:e.code==="23505"?"Username or email already exists.":"Signup failed."},{status:e.code==="23505"?409:500}); }
}