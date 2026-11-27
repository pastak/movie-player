// YAPC::Tokyo 2026 のスポンサー。映像用素材（yapcjapan-site の sponsors.ts から書き出したもの）と同じ並び（申込順）

export type SponsorPlan = Readonly<{
  id: string,
  name: string,
  ja: string,
  // [社名, ロゴのファイル名（src/assets/yapc2026/sponsors/ 以下）]
  sponsors: readonly (readonly [string, string])[],
}>;

export const sponsorPlans: readonly SponsorPlan[] = [
  {
    id: "perl-sponsor",
    name: "Perl Sponsor",
    ja: "パールスポンサー",
    sponsors: [
      ["シックス・アパート株式会社", "sixapart.png"],
      ["株式会社ディー・エヌ・エー", "dena.png"],
      ["さくらインターネット株式会社", "sakura.png"],
      ["株式会社hacomono", "hacomono.png"],
    ],
  },
  {
    id: "platinum-sponsor",
    name: "Platinum Sponsor",
    ja: "プラチナスポンサー",
    sponsors: [
      ["株式会社スマートバンク", "smartbank.png"],
      ["ファインディ株式会社", "findy.png"],
      ["株式会社ハイヤールー", "hireroo.png"],
      ["株式会社CARTA HOLDINGS", "carta.png"],
      ["株式会社アンドパッド", "andpad.png"],
      ["株式会社HelloCloud", "hellocloud.png"],
      ["タイムリープ株式会社", "timeleap.png"],
      ["株式会社クロステック・マネジメント（京都芸術大学）", "xtm.png"],
      ["GMO Flatt Security株式会社", "flatt-security.png"],
      ["Cloudflare Japan株式会社", "cloudflare.png"],
      ["Tebiki株式会社", "tebiki.png"],
      ["株式会社Helpfeel", "helpfeel.png"],
    ],
  },
  {
    id: "gold-sponsor",
    name: "Gold Sponsor",
    ja: "ゴールドスポンサー",
    sponsors: [
      ["SHOWROOM株式会社", "showroom.png"],
      ["株式会社フリークアウト", "freakout.png"],
      ["株式会社はてな", "hatena.png"],
      ["Sansan株式会社", "sansan.png"],
      ["株式会社COLSIS", "colsis.png"],
      ["Repro株式会社", "repro.png"],
      ["株式会社ネコトーストラボ", "nekotoast.png"],
      ["株式会社モバイルファクトリー", "mobile-factory.png"],
      ["株式会社メルカリ", "mercari.png"],
      ["株式会社サンリオ", "sanrio.png"],
      ["株式会社SmartHR", "smarthr.png"],
      ["転職ドラフト", "job-draft.png"],
    ],
  },
  {
    id: "silver-sponsor",
    name: "Silver Sponsor",
    ja: "シルバースポンサー",
    sponsors: [
      ["VAddy", "vaddy.png"],
      ["面白法人カヤック", "kayac.png"],
      ["合同会社武藤電算機技術", "muto-ct.png"],
      ["有限会社エポック", "epoch.png"],
    ],
  },
  {
    id: "bronze-sponsor",
    name: "Bronze Sponsor",
    ja: "ブロンズスポンサー",
    sponsors: [
      ["こだまリサーチ株式会社", "kodamari.png"],
      ["株式会社Diverse", "diverse.png"],
      ["株式会社LayerX", "layerx.png"],
      ["株式会社リンケージ", "linkage.png"],
      ["株式会社グリー", "gree.png"],
      ["湘.なんか", "shonanka.png"],
      ["エムシーディースリー株式会社", "mcd3.png"],
      ["株式会社GENDA", "genda.png"],
      ["株式会社オプティム", "optim.png"],
      ["株式会社永和システムマネジメント", "esm.png"],
      ["合同会社ザウエル", "zauel.png"],
    ],
  },
];
