import { chromium } from '@playwright/test';

const BASE = process.env.URL ?? 'http://localhost:4173/Claudio/';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium' });

// Escritorio: crear proyecto y tarea.
const contexto = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await contexto.newPage();
await page.goto(BASE);
await page.waitForSelector('text=Bienvenido a Claudio');
await page.click('button[title="Nuevo proyecto"]');
await page.fill('input[placeholder="Nombre del proyecto…"]', 'Demo');
await page.keyboard.press('Enter');
await page.click('text=+ Tarea');
await page.fill('input[placeholder="¿Qué hay que hacer?"]', 'Primera tarea');
await page.click('text=Guardar');
await page.waitForSelector('text=Primera tarea');
await page.screenshot({ path: 'captura-escritorio.png' });

// Modo oscuro
await page.click('button[title="Modo oscuro"]');
await page.screenshot({ path: 'captura-oscuro.png' });

// Móvil: mismo contexto para compartir localStorage; probar botones de mover.
const movil = await contexto.newPage();
await movil.setViewportSize({ width: 390, height: 844 });
await movil.goto(BASE);
await movil.waitForSelector('text=Primera tarea');
await movil.click('button[title="Mover a la columna siguiente"]');
await movil.screenshot({ path: 'captura-movil.png' });

console.log('SMOKE OK');
await browser.close();
