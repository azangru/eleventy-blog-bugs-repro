---
title: Article One
date: "2023-12-30"
layout: layouts/post.njk
published: true
---

{% html "styles" %}
<link href="styles.css" rel="stylesheet">
{% endhtml %}

An article that contains an image saved in the same directory as article itself. 

<img src="img.avif" class="test-image">

It also imports styles from a css file saved in the same directory.
