<script>
  import { goto } from '$app/navigation'

  let email
  let name
  let error = ''

  async function submit() {
    const response = await fetch('/signup.json', {
      method: 'POST',
      body: new URLSearchParams({
        name,
        email
      })
    })

    if (response.ok) {
      goto('/sent')
      return
    }

    error = 'An error occurred. Please try again'
  }
</script>

<h1>Sign up</h1>

{#if error}
  <p class="error">{error}</p>
{/if}

<form on:submit|preventDefault={submit}>
  <label>
    <span>Name</span>
    <input name="name" autocomplete="name" bind:value={name} required/>
  </label>

  <label>
    <span>E-mail</span>
    <input name="email" autocomplete="email" type="email" bind:value={email} required/>
  </label>

  <button>Continue</button>
</form>
