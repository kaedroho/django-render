from django.apps import AppConfig
from django.utils.module_loading import autodiscover_modules


class DjangoRenderAppConfig(AppConfig):
    label = "django_render"
    name = "django_render"
    verbose_name = "Django Render"
    default_auto_field = "django.db.models.BigAutoField"

    def ready(self):
        autodiscover_modules("adapters")
