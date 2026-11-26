// Public content repositories: the only way UI code reads Supabase (ADR-005).
export {
  getDiscipline,
  listDisciplines,
  listItemsForDiscipline,
} from "./disciplines";
export { getProfile } from "./profile";
export { getProject, listProjects } from "./projects";
export { contentTags, type ContentType } from "./tags";
export {
  EVIDENCE_SECTIONS,
  type Discipline,
  type DisciplineRef,
  type EvidenceSection,
  type ItemSummary,
  type Media,
  type Profile,
  type Project,
  type ProjectSummary,
  type Seo,
  type SkillRef,
} from "./schemas";
