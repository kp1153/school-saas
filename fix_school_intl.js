const fs = require('fs');
const path = require('path');

const BASE = process.argv[2];
if (!BASE) { console.error('Path दो: node fix_school_intl.js F:\\school-saas'); process.exit(1); }

let fixed = 0;

// 1. layout.js fix
const layoutPath = path.join(BASE, 'app/layout.js');
let layout = fs.readFileSync(layoutPath, 'utf8');

layout = layout.replace(/import \{ NextIntlClientProvider \} from "next-intl";\n/, '');
layout = layout.replace(/import \{ getMessages \} from "next-intl\/server";\n/, '');
layout = layout.replace(/import LanguageToggle from "@\/components\/LanguageToggle";\n/, '');
layout = layout.replace(
  'import { cookies } from "next/headers";',
  'import { cookies } from "next/headers";\nimport Script from "next/script";'
);
layout = layout.replace(/  const locale = cookieStore\.get\("locale"\)\?\.value \|\| "hi";\n/, '');
layout = layout.replace(/  const messages = await getMessages\(\);\n/, '');
layout = layout.replace('<html lang={locale}>', '<html lang="hi">');
layout = layout.replace('        <NextIntlClientProvider messages={messages} locale={locale}>\n', '');
layout = layout.replace('        </NextIntlClientProvider>\n', '');
layout = layout.replace('                  <div className="mt-2">\n                    <LanguageToggle locale={locale} />\n                  </div>\n', '');
layout = layout.replace('                  <LanguageToggle locale={locale} />\n', '');
layout = layout.replace(
  '      </body>',
  `        <div id="google_translate_element" className="fixed bottom-20 right-4 z-50 md:bottom-4" />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {\`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                { pageLanguage: 'hi', includedLanguages: 'en,hi', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                'google_translate_element'
              );
            }
          \`}
        </Script>
      </body>`
);

fs.writeFileSync(layoutPath, layout, 'utf8');
console.log('✅ layout.js fixed');
fixed++;

// 2. dashboard/page.js fix
const dashPath = path.join(BASE, 'app/dashboard/page.js');
let dash = fs.readFileSync(dashPath, 'utf8');
dash = dash.replace(/import \{ getTranslations \} from "next-intl\/server";\n/, '');
dash = dash.replace(/  const t = await getTranslations\("dashboard"\);\n\n/, '');
const tReplacements = [
  ['{t("title")}', 'डैशबोर्ड'],
  ['{t("totalStudents")}', 'कुल छात्र'],
  ['{t("totalTeachers")}', 'कुल शिक्षक'],
  ['{t("pendingFees")}', 'बकाया फीस'],
  ['{t("feesCollected")}', 'फीस जमा'],
  ['{t("presentToday")}', 'आज उपस्थित'],
  ['{t("absentToday")}', 'आज अनुपस्थित'],
  ['{t("totalExams")}', 'कुल परीक्षाएं'],
  ['{t("notices")}', 'सूचनाएं'],
  ['{t("quickActions")}', 'त्वरित कार्य'],
  ['{t("upcomingExams")}', 'आगामी परीक्षाएं'],
  ['{t("recentNotices")}', 'हाल की सूचनाएं'],
];
tReplacements.forEach(([from, to]) => {
  dash = dash.replaceAll(from, to);
});
fs.writeFileSync(dashPath, dash, 'utf8');
console.log('✅ dashboard/page.js fixed');
fixed++;

// 3. set-locale route delete
const setLocalePath = path.join(BASE, 'app/api/set-locale/route.js');
if (fs.existsSync(setLocalePath)) {
  fs.unlinkSync(setLocalePath);
  console.log('✅ app/api/set-locale/route.js deleted');
  fixed++;
}

// 4. LanguageToggle delete
const ltPath = path.join(BASE, 'components/LanguageToggle.js');
if (fs.existsSync(ltPath)) {
  fs.unlinkSync(ltPath);
  console.log('✅ components/LanguageToggle.js deleted');
  fixed++;
}

console.log(`\nकुल ${fixed} changes हुए।`);