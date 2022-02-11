import { aggregateSourceConnection } from "./core-utils";

describe('Core Api', () => {
  const SEARCH_ADDRESS = '0xxxxxxxx';
  const CONNECTION_ADDRESS_A = '0xAxxxxxx';
  const CONNECTION_ADDRESS_B = '0xBxxxxxx';
  const CONNECTION_ADDRESS_C = '0xCxxxxxx';
  const CONNECTION_LINK = 'https://cyberconnect.com/0xxxxb'
  const CYBER_CONNECT = 'CyberConnect';
  const TRANSFER = 'Transfer';
  const TRANSFER_TIME = new Date().toUTCString();

  describe('aggregateSourceConnection', () => {

    it('combine results properly', () => {
      expect(aggregateSourceConnection([
        {
          sourceAddress: SEARCH_ADDRESS,
          address: CONNECTION_ADDRESS_A,
          link: CONNECTION_LINK,
          type: {
            description: 'following',
            label: CYBER_CONNECT
          }
        },
        {
          sourceAddress: CONNECTION_ADDRESS_A,
          address: CONNECTION_ADDRESS_B,
          link: CONNECTION_LINK,
          type: {
            description: 'friend',
            label: CYBER_CONNECT
          }
        },
        {
          sourceAddress: SEARCH_ADDRESS,
          address: CONNECTION_ADDRESS_B,
          link: CONNECTION_LINK,
          type: {
            description: 'followed',
            label: CYBER_CONNECT
          }
        },
        {
          sourceAddress: CONNECTION_ADDRESS_B,
          address: SEARCH_ADDRESS,
          link: CONNECTION_LINK,
          type: {
            description: 'followed',
            label: CYBER_CONNECT
          }
        },
        {
          sourceAddress: SEARCH_ADDRESS,
          address: CONNECTION_ADDRESS_C,
          link: CONNECTION_LINK,
          type: {
            description: 'sent',
            label: TRANSFER
          },
          payload: {
            amount: 0.00666,
            timestamp: TRANSFER_TIME
          }
        }
      ])).toEqual(
        {
          [SEARCH_ADDRESS]: [
            {
              address: CONNECTION_ADDRESS_A,
              link: CONNECTION_LINK,
              payload: {},
              type: {
                description: 'following',
                label: CYBER_CONNECT
              } 
            },
            {
              address: CONNECTION_ADDRESS_B,
              link: CONNECTION_LINK,
              payload: {},
              type: {
                description: 'followed',
                label: CYBER_CONNECT
              }
            },
            {
              address: CONNECTION_ADDRESS_C,
              link: CONNECTION_LINK,
              type: {
                description: 'sent',
                label: TRANSFER
              },
              payload: {
                amount: 0.00666,
                timestamp: TRANSFER_TIME
              }
            }
          ],
          [CONNECTION_ADDRESS_A]: [
            {
              link: CONNECTION_LINK,
              payload: {},
              address: CONNECTION_ADDRESS_B,
              type: {
                description: 'friend',
                label: CYBER_CONNECT
              }
            }
          ],
          [CONNECTION_ADDRESS_B]: [
              {
                address: SEARCH_ADDRESS,
                link: CONNECTION_LINK,
                payload: {},
                type: {
                  description: 'followed',
                  label: CYBER_CONNECT
              }
            }
          ]
        }
      );
    });

  });


});