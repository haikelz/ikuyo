<script lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@ikuyo/ui";

type Lang = "id" | "en";

let lang = $state<Lang>("id");

const content = {
  id: {
    subtitle: "Selamat Hari Raya",
    title: "Idul Fitri 1446 H",
    body1:
      "Minal aidin wal faizin. Mohon maaf lahir dan batin atas segala khilaf dan salah, baik yang disengaja maupun tidak, baik dalam perkataan maupun perbuatan.",
    body2:
      "Semoga amal ibadah kita di bulan Ramadan diterima oleh Allah SWT, dan kita semua senantiasa diberikan kesehatan, keberkahan, serta kemudahan dalam setiap langkah. Selamat merayakan kemenangan bersama keluarga dan orang-orang tercinta.",
  },
  en: {
    subtitle: "Happy",
    title: "Eid Al-Fitr 1446 H",
    body1:
      "May we be among those who return to purity and attain victory. I sincerely ask for your forgiveness for any words or actions — whether intentional or not — that may have caused hurt or offense.",
    body2:
      "May Allah SWT accept our deeds and worship throughout Ramadan, and may He bless us all with health, ease, and abundance in every step of our journey. Wishing you a joyful celebration with your loved ones.",
  },
};

const c = $derived(content[lang]);
</script>

<div class="mx-auto flex w-full flex-col items-start justify-start">
  <section class="mt-8 w-full border-b border-border pb-8 slide-enter-content">
    <div class="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Eid / 1446 H
        </p>
        <p class="mb-1 text-sm text-muted-foreground">
          {c.subtitle}
        </p>
        <h1
          class="mb-0 mt-0 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter text-foreground"
        >
          {c.title}
        </h1>
      </div>
      <ToggleGroup
        type="single"
        bind:value={lang}
        variant="outline"
        spacing={0}
        class="self-start rounded-none border border-border p-0 sm:self-end"
      >
        <ToggleGroupItem value="id" aria-label="Bahasa Indonesia"
          >ID</ToggleGroupItem
        >
        <ToggleGroupItem value="en" aria-label="English">EN</ToggleGroupItem>
      </ToggleGroup>
    </div>
  </section>

  <section class="mt-0 w-full border-b border-border py-8 slide-enter-content">
    <p
      class="text-right text-3xl sm:text-4xl leading-loose tracking-wide font-medium text-foreground"
      style="font-family: 'Noto Naskh Arabic', serif;"
      dir="rtl"
      lang="ar"
    >
      تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
    </p>
    <p class="text-muted-foreground text-base sm:text-lg text-right mt-4">
      Taqabbalallahu minna wa minkum
    </p>
  </section>

  <section class="w-full border-b border-border py-8 slide-enter-content">
    <p
      class="text-foreground text-base sm:text-lg leading-7 sm:leading-relaxed"
    >
      {c.body1}
    </p>
    <p
      class="text-foreground text-base sm:text-lg leading-7 sm:leading-relaxed mt-6"
    >
      {c.body2}
    </p>
  </section>

  <section class="w-full py-6 slide-enter-content">
    <p class="font-mono text-sm text-muted-foreground">
      — Haikel
    </p>
  </section>
</div>
