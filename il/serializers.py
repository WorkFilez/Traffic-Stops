from rest_framework import serializers
from il import models as stops


class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = stops.Agency
        fields = (
            'id', 'name', 'census_profile',
        )
