from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Gym(models.Model):
    owner_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    featured = models.BooleanField(default=False)
    image_url = models.ImageField(upload_to='gym_images/', null=True, blank=True)
    description = models.TextField()
    address = models.TextField()
    phone_number = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Gym"
        verbose_name_plural = "Gyms"
        ordering = ['name']
        

class Class(models.Model):
    gym_id = models.ForeignKey(Gym, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    number_of_classes = models.IntegerField()
    price = models.IntegerField()
    description = models.TextField()
    image_url = models.ImageField(upload_to='class_images/', null=True, blank=True)
    sort_order = models.IntegerField(default=0, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Class"
        verbose_name_plural = "Classes"
        ordering = ['sort_order']


class Plans(models.Model):
    gym_id = models.ForeignKey(Gym, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    duration = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    features = models.TextField()
    sort_order = models.IntegerField(default=0, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    classes = models.ManyToManyField(Class, related_name='classes', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Plan"
        verbose_name_plural = "Plans"
        ordering = ['sort_order']


class Trainer(models.Model):
    gym_id = models.ForeignKey(Gym, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    experience = models.IntegerField()
    image_url = models.ImageField(upload_to='trainer_images/', null=True, blank=True)
    bio = models.TextField()
    sort_order = models.IntegerField(default=0, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Trainer"
        verbose_name_plural = "Trainers"
        ordering = ['sort_order']


class CmsItem(models.Model):
    TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('banner', 'Banner'),
    ]

    gym_id = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='cms_items')
    name = models.CharField(max_length=255)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.gym_id.name} — {self.name}'

    class Meta:
        verbose_name = 'CMS Item'
        verbose_name_plural = 'CMS Items'
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['gym_id', 'name'],
                name='unique_cms_item_per_gym',
            ),
        ]
