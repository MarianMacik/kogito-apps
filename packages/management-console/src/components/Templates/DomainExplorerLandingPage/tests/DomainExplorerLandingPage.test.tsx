import React from 'react';
import { mount } from 'enzyme';
import DomainExplorerLandingPage from '../DomainExplorerLandingPage';
import { GraphQL } from '@kogito-apps/common';
import { MemoryRouter as Router } from 'react-router-dom';

jest.mock('@kogito-apps/common/src/graphql/types');
describe('Domain Explorer Landing Page Component', () => {
  const props = {
    ouiaContext: {
      isOuia: false,
      ouiaId: null
    } as any
  };
  it('Snapshot test', () => {
    // @ts-ignore
    GraphQL.useGetQueryFieldsQuery.mockReturnValue({
      loading: false,
      data: {
        __type: {
          fields: [
            {
              name: 'Jobs',
              args: []
            },
            {
              name: 'Travels',
              args: []
            },
            {
              name: 'visaApplication',
              args: []
            }
          ]
        }
      }
    });
    const wrapper = mount(
      <Router keyLength={0}>
        <DomainExplorerLandingPage {...props} />
      </Router>
    );
    expect(GraphQL.useGetQueryFieldsQuery).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });
  it('Assertions', () => {
    // @ts-ignore
    GraphQL.useGetQueryFieldsQuery.mockReturnValue({
      loading: false,
      data: {
        __type: {
          fields: [
            {
              name: 'Travels',
              args: [
                {
                  name: 'where',
                  type: {
                    kind: 'INPUT_OBJECT',
                    name: 'TravelsArgument'
                  }
                },
                {
                  name: 'orderBy',
                  type: {
                    kind: 'INPUT_OBJECT',
                    name: 'TravelsOrderBy'
                  }
                }
              ],
              type: { ofType: { name: 'Travels' } }
            },
            {
              name: 'visaApplication',
              args: [
                {
                  name: 'where',
                  type: {
                    kind: 'INPUT_OBJECT',
                    name: 'VisaApplicationsArgument'
                  }
                },
                {
                  name: 'orderBy',
                  type: {
                    kind: 'INPUT_OBJECT',
                    name: 'VisaApplicationsOrderBy'
                  }
                }
              ],
              type: { ofType: { name: 'VisaApplications' } }
            }
          ]
        }
      }
    });
    const wrapper = mount(
      <Router keyLength={0}>
        <DomainExplorerLandingPage {...props} />
      </Router>
    );
    expect(GraphQL.useGetQueryFieldsQuery).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });
});
