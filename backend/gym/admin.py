from django.contrib import admin
from .models import Gym, Class, Plans, Trainer, CmsItem

admin.site.register(Gym)
admin.site.register(Class)
admin.site.register(Plans)
admin.site.register(Trainer)
admin.site.register(CmsItem)