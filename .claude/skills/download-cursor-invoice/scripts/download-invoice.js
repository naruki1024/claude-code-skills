#!/usr/bin/env node

/**
 * Cursor Console Invoice Downloader
 *
 * Cursorの課金コンソールから最新の請求書PDFをダウンロードします。
 * Playwrightを使用してブラウザを自動操作します。
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// 設定
const CONFIG = {
  // Cursorの設定ページURL
  settingsUrl: 'https://www.cursor.com/settings',

  // ダウンロード先ディレクトリ
  downloadDir: path.join(process.env.HOME, 'Downloads', 'cursor-invoices'),

  // タイムアウト設定（ミリ秒）
  timeout: 60000,

  // ログイン待機時間（ミリ秒）
  loginWaitTime: 120000, // 2分
};

async function main() {
  console.log('🚀 Cursor請求書ダウンローダーを起動します...\n');

  // ダウンロードディレクトリの作成
  if (!fs.existsSync(CONFIG.downloadDir)) {
    fs.mkdirSync(CONFIG.downloadDir, { recursive: true });
    console.log(`📁 ダウンロードディレクトリを作成: ${CONFIG.downloadDir}`);
  }

  // ブラウザを起動（headed モード）
  const browser = await chromium.launch({
    headless: false, // ブラウザを表示
    slowMo: 100,     // 操作を少し遅くして見やすく
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });

  const page = await context.newPage();

  try {
    // Cursor設定ページにアクセス
    console.log('🌐 Cursorの設定ページにアクセス中...');
    await page.goto(CONFIG.settingsUrl, { waitUntil: 'networkidle' });

    // ログイン状態を確認
    console.log('\n⏳ ログイン状態を確認中...');
    console.log('   もしログイン画面が表示された場合は、手動でログインしてください。');
    console.log('   （2分以内にログインを完了してください）\n');

    // ログインまたは設定ページの読み込みを待機
    await page.waitForFunction(() => {
      // 設定ページの要素が表示されているか確認
      return document.body.innerText.includes('Settings') ||
             document.body.innerText.includes('Billing') ||
             document.body.innerText.includes('設定');
    }, { timeout: CONFIG.loginWaitTime });

    console.log('✅ ログイン確認完了\n');

    // Billingセクションを探す
    console.log('🔍 請求書セクションを探しています...');

    // Billingリンクをクリック
    const billingLink = await page.locator('text=Billing').first();
    if (await billingLink.isVisible()) {
      await billingLink.click();
      await page.waitForTimeout(2000);
    }

    // 請求書/Invoice リンクを探す
    console.log('📄 請求書を探しています...');

    // Invoicesリンクまたはダウンロードボタンを探す
    const invoiceSelectors = [
      'text=Invoices',
      'text=Invoice',
      'text=請求書',
      'text=View invoices',
      'text=Download invoice',
      'text=Download PDF',
      'a[href*="invoice"]',
      'button:has-text("Invoice")',
    ];

    let invoiceFound = false;
    for (const selector of invoiceSelectors) {
      const element = await page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        console.log(`   発見: ${selector}`);
        invoiceFound = true;

        // ダウンロードを待機
        const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

        await element.click();
        await page.waitForTimeout(2000);

        const download = await downloadPromise;
        if (download) {
          const fileName = `cursor-invoice-${new Date().toISOString().slice(0, 7)}.pdf`;
          const filePath = path.join(CONFIG.downloadDir, fileName);
          await download.saveAs(filePath);
          console.log(`\n✅ 請求書をダウンロードしました: ${filePath}`);
          break;
        }
      }
    }

    if (!invoiceFound) {
      console.log('\n⚠️  請求書リンクが見つかりませんでした。');
      console.log('   ページを確認してください。手動でダウンロードできます。');
      console.log('   ブラウザは開いたままにしています。\n');

      // 手動操作のために待機
      console.log('   Enterキーを押すとブラウザを閉じます...');
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    console.log('\n   ブラウザは開いたままにしています。');
    console.log('   手動で操作するか、Enterキーを押して終了してください。');

    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } finally {
    await browser.close();
    console.log('\n👋 ブラウザを閉じました。');
  }
}

// Playwrightがインストールされているか確認
async function checkPlaywright() {
  try {
    require('playwright');
    return true;
  } catch {
    console.log('📦 Playwrightをインストールしています...');
    const { execSync } = require('child_process');
    execSync('npm install playwright', { stdio: 'inherit' });
    execSync('npx playwright install chromium', { stdio: 'inherit' });
    return true;
  }
}

// メイン実行
checkPlaywright().then(() => main()).catch(console.error);
