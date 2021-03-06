from django.db import connections
from django.shortcuts import render
from .models import Stop, Agency, Person
from . import forms
from traffic_stops import base_views
from tsdata.dataset_facts import get_dataset_facts_context


class Home(base_views.Home):
    form_class = forms.AgencySearchForm
    template_name = 'nc.html'
    success_url = 'nc:agency-detail'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)
        context['find_a_stop_form'] = forms.SearchForm()
        context.update(get_dataset_facts_context())
        return context


def search(request):
    query = None
    if request.method == 'GET' and request.GET:
        form = forms.SearchForm(request.GET)
        if form.is_valid():
            query = form.get_query()
    else:
        form = forms.SearchForm()

    if query:
        people = Person.objects.filter(query)
    else:
        people = Person.objects.none()
    people = people.select_related('stop').order_by('stop__date')
    connection = connections[people.db]
    with connection.cursor() as cursor:
        # Disable seq scanning when generating this count
        # Override the count to produce this result for the pagination
        # Might not be necessary if we adjusted the random_page_cost
        # See https://stackoverflow.com/questions/10643215/
        cursor.execute('SET enable_seqscan = OFF;')
        total = people.count()
        people.count = lambda: total
        cursor.execute('SET enable_seqscan = ON;')
    context = {
        'form': form,
        'people': people,
    }
    return render(request, 'nc/search.html', context)


class AgencyList(base_views.AgencyList):
    model = Agency
    form_class = forms.AgencySearchForm
    success_url = 'nc:agency-detail'


class AgencyDetail(base_views.AgencyDetail):
    model = Agency
    stop_model = Stop
