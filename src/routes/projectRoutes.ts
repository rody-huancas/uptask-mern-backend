import { Router } from "express";
import { body, param } from "express-validator";

import { authenticate } from "../middleware/auth";
import { projectExists } from "../middleware/project";
import { TaskController } from "../controllers/TaskController";
import { NoteController } from "../controllers/NoteController";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TeamMemberController } from "../controllers/TeamController";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  body("projectName")
    .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty().withMessage("La Descripción del Proyecto es Obligatoria"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  ProjectController.getProjectById
);


// Routes for tasks
router.param('projectId', projectExists)

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty().withMessage("La Descripción del Proyecto es Obligatoria"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);


router.post(
  '/:projectId/tasks',
  hasAuthorization,
  body("name")
    .notEmpty().withMessage("El Nombre de la Tarea es Obligatorio"),
  body("description")
    .notEmpty().withMessage("La Descripción de la Tarea es Obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get(
  '/:projectId/tasks',
  TaskController.getProjectTasks
);

router.get(
  '/:projectId/tasks/:taskId',
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name")
    .notEmpty().withMessage("El Nombre de la Tarea es Obligatorio"),
  body("description")
    .notEmpty().withMessage("La Descripción de la Tarea es Obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  '/:projectId/tasks/:taskId/status',
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status")
    .notEmpty().withMessage("El Estado de la Tarea es Obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

// Routes for team
router.post("/:projectId/team/find",
  body("email")
    .isEmail().toLowerCase().withMessage("El correo electrónico no es válido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team",
  TeamMemberController.getProjectTeam
);

router.post("/:projectId/team",
  body("id")
    .isMongoId().withMessage("ID No válido"),
  handleInputErrors,
  TeamMemberController.addMemberById
);

router.delete("/:projectId/team/:userId",
  param("userId")
    .isMongoId().withMessage("ID No válido"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

// Routes for Notes
router.post('/:projectId/tasks/:taskId/notes', 
  body("content")
    .notEmpty().withMessage("El Contenido de la nota es obligatorio."),
  handleInputErrors,
  NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', 
  NoteController.getTaskNotes
);

router.delete('/:projectId/tasks/:taskId/notes/:noteId', 
  param("noteId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  NoteController.deleteNote
);

export default router;
