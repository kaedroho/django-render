<h1 align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="website/static/img/django-render-text-black.svg">
        <source media="(prefers-color-scheme: dark)" srcset="website/static/img/django-render-text.svg">
        <img width="350" src="website/static/img/django-render-text-black.svg" alt="Django Render">
    </picture>
</h1>

<p align="center">
    <br>
    <a href="https://github.com/kaedroho/django-render/actions">
        <img src="https://github.com/kaedroho/django-render/workflows/Django%20Render%20CI/badge.svg" alt="Build Status" />
    </a>
    <a href="https://opensource.org/licenses/BSD-3-Clause">
        <img src="https://img.shields.io/badge/license-BSD-blue.svg" alt="License" />
    </a>
    <a href="https://pypi.python.org/pypi/djrender/">
        <img src="https://img.shields.io/pypi/v/djrender.svg" alt="Version" />
    </a>
    <a href="https://pypi.python.org/pypi/djrender/">
        <img src="https://img.shields.io/badge/Documentation-blue" alt="Documentation" />
    </a>
</p>

Django Render allows you to build fully client-rendered React applications backed by Django views.
It also supports Django forms, session authentication and messages.

## Key Features

 - Build React applications using Django's URL routing, views, and forms
 - Build Django applications with fast, reactive user interfaces
 - Open URLs in overlays to build modal interfaces
 - Supports Storybook and Vite hot module reloading

Find out more at [django-render.org](https://django-render.org)

## Demo project

Have a look at our demo project to see Django Render in action!

Live Demo: [demo.django-render.org](https://demo.django-render.org)
Source code: [github.com/kaedroho/djangopress](https://github.com/kaedroho/djangopress)

## Support

For support, please reach out to us on [GitHub discussions](https://github.com/kaedroho/django-render/discussions)

## Project status

This has been a side-project while at Torchbox and HarperCollins over the last four years. It has already been used successfully in production for both [public SaaS](https://app.wagtail.build) and internal applications.

I've recently been working on converting the code, which has been sitting on my Github account all this time, into something that can be used more widely. This involves a lot of API refinement, adding docs, building a demo, and a website.

I'm planning for a 0.1 final release in the summer of 2024.
