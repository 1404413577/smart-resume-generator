# Third-Party Notices

This project uses open-source software, open fonts, and optional third-party AI services. The project does not claim ownership of third-party trademarks, services, models, fonts, or libraries.

The project source code is licensed under the MIT License unless a file states otherwise. Third-party dependencies, fonts, APIs, services, models, and user-provided content remain subject to their own licenses and terms.

## Open-Source Dependencies

The dependency tree is primarily licensed under permissive licenses such as MIT, Apache-2.0, BSD, and ISC. Keep each dependency's original license text available when redistributing this project or a bundled build.

Notable dependencies and license choices:

- `vue`, `vite`, `pinia`, `element-plus`, `@element-plus/icons-vue`, `@vueuse/core`: permissive open-source licenses.
- `html2canvas`, `jspdf`, `docx`, `docxtemplater`, `dexie`, `vuedraggable`: permissive open-source licenses.
- `dompurify`: dual licensed as MPL-2.0 or Apache-2.0; this project uses it under Apache-2.0 where applicable.
- `jszip`: dual licensed as MIT or GPL-3.0-or-later; this project uses it under MIT where applicable.
- `pizzip`: dual licensed as MIT or GPL-3.0; this project uses it under MIT where applicable.
- `caniuse-lite`: CC-BY-4.0. It is build/browser compatibility data; keep attribution when redistributing notices.
- `flatbuffers`: Apache-2.0 according to the bundled `LICENSE.txt`. Preserve its original notice when redistributing.
- `rgbcolor`: optional dependency with MIT or bundled permissive `FEEL-FREE.md` terms. Preserve its original notice when redistributing if it is included in the bundle.

This file is not a substitute for the original package license files. If you publish, sell, or redistribute the project, include the original license notices generated from the actual installed dependency tree.

## Fonts

Default resume fonts are configured to use the open-source Noto / Source Han family:

- Noto Sans SC / Source Han Sans SC
- Noto Serif SC / Source Han Serif SC

These fonts are distributed under open font licenses by their respective maintainers. If you self-host font files, include the matching font license files. Avoid bundling proprietary fonts such as Microsoft YaHei, PingFang SC, Helvetica, Arial, SimSun, or commercial foundry fonts unless you have explicit redistribution rights.

## Icons and Generated Assets

The app uses Element Plus icons and simple generated SVG icons. Do not replace these with icon fonts, paid icon packs, or copied brand icons unless their licenses allow the intended use.

Generated public assets such as `favicon.svg`, `icon-*.svg`, `sitemap.xml`, and `sitemap.html` are project-generated files. They should not include third-party artwork or brand marks.

## Trademarks

Names such as OpenAI, Google, Gemini, Ollama, GitHub, LinkedIn, Adobe, Figma, Sketch, Vue, React, and AWS may appear as compatibility labels, field labels, examples, or user-entered content. They are trademarks or service marks of their respective owners. This project is not affiliated with, endorsed by, or sponsored by those owners.

Use third-party brand names only for accurate compatibility descriptions or user-facing field labels. Do not use third-party logos or imply endorsement.

## AI Services and Models

The app can be configured to call user-provided AI services or browser-local models. Users and deployers are responsible for checking the terms and licenses of the selected AI service, API, and model weights before use. Some models or APIs may restrict commercial use, redistribution, generated output use, or local caching.

Do not bundle model weights into this project unless their license allows redistribution and the required notices are included.

## User Content

Users own the resume text, uploaded avatars, and attachments they provide. Users are responsible for ensuring they have the right to upload and export photos, logos, work samples, portfolio links, and other materials. The project should not ship with copyrighted photos, commercial resume templates, copied designs, or unauthorized sample content.

## Project Templates

Resume templates in this repository are implemented as project source code. When adding new templates, do not copy paid templates, commercial template marketplaces, branded resume layouts, or distinctive third-party visual systems. Build original layouts or use assets with clear compatible licenses.
