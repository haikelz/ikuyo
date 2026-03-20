<script lang="ts">
  type Lang = "id" | "en";

  let lang = $state<Lang>("id");

  const content = {
    id: {
      subtitle: "Selamat Hari Raya",
      title: "Idul Fitri 1446 H",
      body1:
        "Minal aidin wal faizin. Mohon maaf lahir dan batin atas segala khilaf dan salah, baik yang disengaja maupun tidak, baik dalam perkataan maupun perbuatan.",
      body2:
        "Semoga amal ibadah kita di bulan Ramadan diterima oleh Allah \uFDFD, dan kita semua senantiasa diberikan kesehatan, keberkahan, serta kemudahan dalam setiap langkah. Selamat merayakan kemenangan bersama keluarga dan orang-orang tercinta.",
    },
    en: {
      subtitle: "Happy",
      title: "Eid Al-Fitr 1446 H",
      body1:
        "May we be among those who return to purity and attain victory. I sincerely ask for your forgiveness for any words or actions — whether intentional or not — that may have caused hurt or offense.",
      body2:
        "May Allah \uFDFD accept our deeds and worship throughout Ramadan, and may He bless us all with health, ease, and abundance in every step of our journey. Wishing you a joyful celebration with your loved ones.",
    },
  };

  const c = $derived(content[lang]);
</script>

<div class="flex w-full flex-col items-start justify-start">
  <section class="w-full m-0! p-0! slide-enter-content">
    <div class="flex items-center justify-between w-full">
      <div>
        <p class="text-neutral-400 text-sm mb-0">{c.subtitle}</p>
        <h1 class="mb-0">{c.title}</h1>
      </div>
      <div class="flex items-center gap-1 rounded-lg border border-white/10 p-1 self-end mb-1">
        <button
          onclick={() => (lang = "id")}
          class="rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer outline-none {lang === 'id'
            ? 'bg-white/10 text-white'
            : 'text-neutral-500 hover:text-neutral-300'}"
        >
          ID
        </button>
        <button
          onclick={() => (lang = "en")}
          class="rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer outline-none {lang === 'en'
            ? 'bg-white/10 text-white'
            : 'text-neutral-500 hover:text-neutral-300'}"
        >
          EN
        </button>
      </div>
    </div>
  </section>

  <section class="w-full m-0! p-0! mt-10 slide-enter-content">
    <p
      class="text-right text-3xl leading-loose tracking-wide"
      style="font-family: 'Noto Naskh Arabic', serif;"
      dir="rtl"
      lang="ar"
    >
      تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
    </p>
    <p class="text-neutral-400 text-sm mt-2 text-right">
      Taqabbalallahu minna wa minkum
    </p>
  </section>

  <section class="w-full m-0! p-0! mt-10 slide-enter-content">
    <p class="text-neutral-300 leading-relaxed text-justify">
      {c.body1}
    </p>
    <p class="text-neutral-300 leading-relaxed text-justify mt-4">
      {c.body2}
    </p>
  </section>

  <section class="w-full m-0! p-0! mt-10 slide-enter-content">
    <p class="text-neutral-500 text-sm">— Haikel</p>
  </section>
</div>
