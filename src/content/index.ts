import type { Course, CourseId } from '../types'
import { course as enBase } from './courses/en'
import { course as esBase } from './courses/es'
import { course as frBase } from './courses/fr'
import { course as deBase } from './courses/de'
import { course as itBase } from './courses/it'
import { course as ptBase } from './courses/pt'
import { section as enS2 } from './courses/en-s2'
import { section as enS3 } from './courses/en-s3'
import { section as esS2 } from './courses/es-s2'
import { section as esS3 } from './courses/es-s3'
import { section as frS2 } from './courses/fr-s2'
import { section as frS3 } from './courses/fr-s3'
import { section as deS2 } from './courses/de-s2'
import { section as deS3 } from './courses/de-s3'
import { section as itS2 } from './courses/it-s2'
import { section as itS3 } from './courses/it-s3'
import { section as ptS2 } from './courses/pt-s2'
import { section as ptS3 } from './courses/pt-s3'

const en: Course = { ...enBase, sections: [...enBase.sections, enS2, enS3] }
const es: Course = { ...esBase, sections: [...esBase.sections, esS2, esS3] }
const fr: Course = { ...frBase, sections: [...frBase.sections, frS2, frS3] }
const de: Course = { ...deBase, sections: [...deBase.sections, deS2, deS3] }
const it: Course = { ...itBase, sections: [...itBase.sections, itS2, itS3] }
const pt: Course = { ...ptBase, sections: [...ptBase.sections, ptS2, ptS3] }

export const courses: Record<CourseId, Course> = { en, es, fr, de, it, pt }
export const courseList: Course[] = [en, es, fr, de, it, pt]
