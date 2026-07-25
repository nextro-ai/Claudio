import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
await page.goto('http://localhost:4173');
await page.waitForSelector('text=Bienvenido a Claudio');
// Crear proyecto
await page.click('button[title="Nuevo proyecto"]');
await page.fill('input[placeholder="Nombre del proyecto…"]', 'Demo');
await page.keyboard.press('Enter');
await page.waitForSelector('text=Demo');
// Crear tarea
await page.click('text=+ Nueva tarea');
await page.fill('input[placeholder="¿Qué hay que hacer?"]', 'Primera tarea');
await page.click('text=Guardar');
await page.waitForSelector('text=Primera tarea');
await page.screenshot({ path: '/tmp/claude-0/-home-user-nextro1/33634033-5324-5a9d-bf43-3f671353dba2/scratchpad/claudio.png', fullPage: false });
console.log('SMOKE OK');
await browser.close();
