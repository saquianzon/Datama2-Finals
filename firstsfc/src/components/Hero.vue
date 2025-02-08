<template>
  <section class="hero">
    <img src="/images/Chicken.png" alt="Inasal Chicken">
    <div class="hero-text">
      <h1>Dodoy's Grill House</h1>
      <h3>Gutom ka? Order na, abot sadya!</h3>
    </div>
  </section>
</template>

<style>
.hero {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: bold;
}
</style>
