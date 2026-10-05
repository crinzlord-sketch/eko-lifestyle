import crypto from "crypto";
import { pool } from "@/lib/db";
export async function POST(req: Request) {
 try { const b=await req.json(); const r=await pool.query("SELECT id,username,email,password_hash,age FROM users WHERE email=$1",[String(b.email||"").toLowerCase()]);
 if(!r.rowCount)return Response.json({error:"Invalid email or password."},{status:401});
 const [salt,stored]=r.rows[0].password_hash.split(":"); const check=crypto.scryptSync(b.password,salt,64);
 if(!crypto.timingSafeEqual(check,Buffer.from(stored,"hex")))return Response.json({error:"Invalid email or password."},{status:401});
 return Response.json({user:r.rows[0]}); } catch { return Response.json({error:"Login failed."},{status:500}); }
}