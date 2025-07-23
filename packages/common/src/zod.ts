import z from "zod"

export const userValid = z.object({
    username :z.string().min(4).max(20),
    email : z.string().min(4).max(20).email(),
    password :z.string().min(4).max(20).regex(/[A-Z]/)

})