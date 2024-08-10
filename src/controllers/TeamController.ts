import type { Request, Response } from "express"
import User from "../models/User";

export class TeamMemberController {
    static findMemberByEmail = async(req: Request, res: Response) => {
        const { email } = req.body;

        // Find User
        const user = await User.findOne({ email }).select('id email name');

        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }

        res.json(user);
    }
}