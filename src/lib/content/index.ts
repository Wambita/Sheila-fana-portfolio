// Public content repositories: the only way UI code reads Supabase (ADR-005).
export {
  getDiscipline,
  listDisciplines,
  listItemsForDiscipline,
} from "./disciplines";
export { listFeaturedExperience } from "./items";
export { getProfile } from "./profile";
export { getProject, listProjects } from "./projects";
export { listDisciplineSkills, listSkillOverview } from "./skills";
export { contentTags, type ContentType } from "./tags";
export {
  EVIDENCE_SECTIONS,
  PORTFOLIO_SECTIONS,
  SKILL_KINDS,
  type Discipline,
  type DisciplineRef,
  type DisciplineSkill,
  type EvidenceSection,
  type ItemSummary,
  type Media,
  type PortfolioSection,
  type Profile,
  type Project,
  type ProjectSummary,
  type Seo,
  type SkillCategory,
  type SkillKind,
  type SkillRef,
} from "./schemas";
