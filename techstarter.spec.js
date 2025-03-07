const { test, expect } = require('@playwright/test');

test('Techstarter Webseite Grundfunktionen', async ({ page }) => {
  await page.goto('https://www.techstarter.de');
  console.log('Seite geladen');

  // **Cookie-Banner schließen**
  const acceptCookiesButton = page.locator('text="Alle akzeptieren"');
  if (await acceptCookiesButton.isVisible()) {
    console.log('Cookie-Banner gefunden, akzeptiere Cookies...');
    await acceptCookiesButton.click();
    await acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 });
  }

  // **Warten auf Hauptinhalt**
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('h1');

  // **Debugging: Alle sichtbaren Überschriften ausgeben**
  const allHeadings = await page.locator('h1, h2, h3').allInnerTexts();
  console.log('Gefundene Überschriften:', allHeadings);

  // **Wichtige Überschriften überprüfen**
  const mainHeadings = [
    { text: 'Starte mit uns deine IT-Karriere', tag: 'h1' },
    { text: 'Eine Weiterbildung. Viele Möglichkeiten.', tag: 'h2' },
    { text: 'KI, Linux, Cloud- & Webentwicklung', tag: 'h3' }  // Targeting specific tag
  ];

  for (const { text, tag } of mainHeadings) {
    const headingLocator = page.locator(tag).filter({ hasText: new RegExp(text.trim(), 'i') });

    // **Scrollen, falls nötig**
    await headingLocator.scrollIntoViewIfNeeded();

    // **Sicherstellen, dass es sichtbar ist**
    await headingLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log(`WARNUNG: Überschrift nicht gefunden: "${text}"`);
    });

    // **Screenshot für Debugging**
    await page.screenshot({ path: `debug-${text}.png`, fullPage: true });

    expect(await headingLocator.isVisible()).toBeTruthy();
    console.log(`Überschrift gefunden: "${text}"`);
  }

  console.log('Test erfolgreich abgeschlossen.');
});
