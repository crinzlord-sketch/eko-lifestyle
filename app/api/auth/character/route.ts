import { randomUUID } from "crypto";
import { pool } from "@/lib/db";
export async function POST(req: Request) {
 try { const b=await req.json(); const id=randomUUID(); await pool.query("INSERT INTO characters(id,user_id,first_name,last_name,gender,skin,hair,style,background,neighborhood) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[id,b.userId,b.firstName,b.lastName,b.gender,b.skin,b.hair,b.style,b.background,b.neighborhood]); return Response.json({characterId:id}); }
 catch(e:any){return Response.json({error:e.code==="23505"?"Character already exists.":"Character creation failed."},{status:e.code==="23505"?409:500});}
}