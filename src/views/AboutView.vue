<template>
  <section class="about-page">
    <h1>Vitajte v online obchode!</h1>
    <p class="intro-text">Toto je záverečný projekt kurzu SDA Java.</p>

    <div class="about-content">
      <p>
        Je to jednoduchý internetový obchod s produktmi, nákupným košíkom a overovaním používateľov.
      </p>
      <p>Pozrite si produkty, pridajte ich do košíka a prejdite k pokladni.</p>
      <p>Alebo sa prihláste a skontrolujte svoje objednávky.</p>
    </div>

    <p class="enjoy-text">🎉 Príjemnú zábavu! 🎉</p>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
/* 📌 Celkové rozloženie sekcie */
.about-page {
  max-width: 800px;
  margin: auto;
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 🏆 Nadpis */
h1 {
  color: #00bde7;
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* 📝 Texty */
p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

/* ✅ Úvodný text */
.intro-text {
  font-weight: bold;
  font-size: 1.2rem;
  color: #007bbf;
}

/* 📦 Obsah */
.about-content {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

/* 🎉 Záverečný text */
.enjoy-text {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4caf50;
  margin-top: 1.5rem;
}
</style>
