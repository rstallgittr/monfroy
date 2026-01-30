---
layout: default
title: Trivia
---

<p>Select a week:</p>

<ul>
  {% assign trivia_pages = site.pages | sort: "title" | reverse %}
  {% for page in trivia_pages %}
    {% if page.url contains '/trivia/' and page.url != '/trivia/' %}
      <li><a href="{{ page.url }}">{{ page.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
