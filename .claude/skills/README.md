# Skills de creación web

Skills de Claude Code instaladas a nivel de proyecto. Claude las carga automáticamente al trabajar en este repositorio; también se pueden invocar con `/<nombre>`.

| Skill | Para qué sirve | Origen | Licencia |
|---|---|---|---|
| `frontend-design` | Interfaces con diseño distintivo, sin el aspecto genérico de IA | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | Apache 2.0 |
| `web-artifacts-builder` | Apps web multi-archivo con React + Tailwind + shadcn/ui | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | Apache 2.0 |
| `theme-factory` | Temas de color y tipografía listos para aplicar | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | Apache 2.0 |
| `canvas-design` | Piezas visuales (pósters, logos, gráficos) en PNG/PDF | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | Apache 2.0 |
| `webapp-testing` | Probar la web en un navegador real con Playwright | [anthropics/skills](https://github.com/anthropics/skills) @ `8a1541c` | Apache 2.0 |
| `web-design-guidelines` | Auditoría de accesibilidad, rendimiento y UX (100+ reglas) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) @ `063bee9` | MIT |
| `vercel-react-best-practices` | Rendimiento y buenas prácticas en React / Next.js | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) @ `063bee9` | MIT |
| `impeccable` | Dirección de diseño con 24 comandos (`/impeccable polish`, `audit`, `colorize`, `bolder`…) | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v4.5.0 @ `e103efe` | Apache 2.0 |
| `ui-ux-pro-max` | Base de datos local de estilos, paletas, tipografías y guías UX | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.13.0 @ `09170ee` | MIT |
| `brand` | Identidad de marca: colores, voz y tokens a partir de un logo o guía | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.13.0 @ `09170ee` | MIT |

## Notas

- `impeccable` descarga su motor desde las releases de GitHub del autor (con verificación sha256) la primera vez que se usa. Si no hay red, la skill sigue funcionando en modo manual. No se instalaron sus hooks automáticos (revisión tras cada edición).
- `web-design-guidelines` descarga las reglas actualizadas de `raw.githubusercontent.com` en cada revisión.
- Para actualizar una skill, vuelve a copiar su carpeta desde el repositorio de origen.
