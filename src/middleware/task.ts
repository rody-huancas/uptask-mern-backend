import Task, { ITask } from "../models/Task";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function taskExists( req: Request, res: Response, next: NextFunction ) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(400).json({ error: error.message });
    }

    req.task = task;

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
