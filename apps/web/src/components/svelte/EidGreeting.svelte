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

<div class="flex w-full flex-col items-start justify-start mx-auto">
  <section class="w-full mt-8 slide-enter-content">
    <div class="flex items-center justify-between w-full">
      <div>
        <p class="text-muted-foreground text-lg sm:text-xl mb-2">
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
        class="self-end mb-1 rounded-lg border border-border/70 p-1"
      >
        <ToggleGroupItem value="id" aria-label="Bahasa Indonesia"
          >ID</ToggleGroupItem
        >
        <ToggleGroupItem value="en" aria-label="English">EN</ToggleGroupItem>
      </ToggleGroup>
    </div>
  </section>

  <section class="w-full mt-8 slide-enter-content">
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

  <section class="w-full mt-8 slide-enter-content">
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

  <section class="w-full slide-enter-content">
    <p class="text-muted-foreground text-base sm:text-lg font-medium">
      — Haikel
    </p>
  </section>
</div>
