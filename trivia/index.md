---
layout: default
title: Trivia Homepage
---

<p>Select a week:</p>

<ul>
  {% for page in site.pages %}
    {% if page.url contains '/trivia/' and page.url != '/trivia/' %}
      <li><a href="{{ page.url }}">{{ page.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>

