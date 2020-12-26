<p align="center">
   <img width="64" src="logo.svg" alt="Formtrack logo">
</p>

<h1 align="center">Formtrack</h1>

<p align="center">
    Automatically inject UTM parameters into your HTML form submissions.
</p>

<p align="center">
    Sponsored by <a href="https://formspark.io">Formspark</a>, the simple & powerful form solution for developers.
</p>

[![Continuous deployment](https://github.com/formspark/formtrack/workflows/Continuous%20deployment/badge.svg)](https://github.com/formspark/formtrack/actions?query=workflow%3A%22Continuous+deployment%22)

## Installation

```html
<script src="https://unpkg.com/@formspark/formtrack"></script>
```

## Usage

Add a `data-formtrack` attribute to your form element.

```html
<form action="https://submit-form.com" data-formtrack>
  <input type="text" name="message" />
  <button type="submit">Send</button>
</form>
```

## Supported parameters

- referrer
- utm_campaign
- utm_content
- utm_medium
- utm_source
- utm_term

## License

[MIT](https://opensource.org/licenses/MIT)
