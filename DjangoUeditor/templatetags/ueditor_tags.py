from django import template
import json

register = template.Library()

@register.filter
def tojson(value):
    return json.dumps(value)