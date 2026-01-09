---
layout: default
title: Trivia Homepage
---

<p>Select a week:</p>

<ul>
  {% for week in site.pages %}
    {% if week.url contains '/trivia/week-' %}
      <li><a href="{{ week.url }}">{{ week.title }}</a></li>
    {% endif %}
  {% endfor %}
</ul>
