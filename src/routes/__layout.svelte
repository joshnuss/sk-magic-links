<script>
  import '../app.css'
</script>

<main>
  <slot/>
</main>

<style>
  main {
    background: white;
    padding: 2rem;
    border-radius: 5px;
    place-self: center;
    min-width: 300px;
    box-shadow: 3px 3px #2223;
  }
</style>
