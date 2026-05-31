"""Default CMS branding items seeded for each gym."""

DEFAULT_CMS_ITEMS = [
    ('Hero Section Main', 'STAY HEALTHY, STAY FIT', 'text'),
    ('Hero Section Sub', 'GET IN SHAPE NOW', 'text'),
    (
        'Hero Section Description',
        'Train in the fitness gym and explore all benefits',
        'text',
    ),
    ('Feature Banner', 'Transform Your Body, Transform Your Life', 'banner'),
    ('Business Logo', '/images/logo.png', 'image'),
    ('Business Timing', 'Monday - Saturday\n6:00 - 22:00', 'text'),
    ('Business Email', 'contact@fitness.com', 'text'),
    ('Business Contact', '9999999999', 'text'),
    ('Feature Heading', 'Why Choose Us', 'text'),
    (
        'Feature Description',
        'We provide world-class facilities, expert trainers, and a supportive community to help you achieve your fitness goals.',
        'text',
    ),
    ('Class List Heading', 'Our Classes', 'text'),
    (
        'Class List Description',
        'Choose from a variety of expert-led classes designed to challenge and inspire you at every fitness level.',
        'text',
    ),
    ('Plan List Heading', 'Membership Plans', 'text'),
    (
        'Plan List Description',
        'Find the perfect membership plan that fits your lifestyle and budget.',
        'text',
    ),
    ('Trainer List Heading', 'Meet Our Trainers', 'text'),
    (
        'Trainer List Description',
        'Our certified trainers are passionate about helping you reach your goals.',
        'text',
    ),
]


def ensure_gym_cms_defaults(gym):
    from .models import CmsItem

    for name, content, item_type in DEFAULT_CMS_ITEMS:
        CmsItem.objects.get_or_create(
            gym_id=gym,
            name=name,
            defaults={'content': content, 'type': item_type},
        )
