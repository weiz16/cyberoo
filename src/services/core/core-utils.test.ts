import { aggregateSourceConnection } from "./core.utils";

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
          address: CONNECTION_ADDRESS_A,
          link: CONNECTION_LINK,
          type: {
            description: 'following',
            label: CYBER_CONNECT
          }
        },
        {
          address: CONNECTION_ADDRESS_B,
          link: CONNECTION_LINK,
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
      ], SEARCH_ADDRESS)).toEqual(
        {
          address: SEARCH_ADDRESS,
          linkedConnections: {
            [CONNECTION_ADDRESS_A]: [
              {
                link: CONNECTION_LINK,
                payload: {},
                type: {
                  description: 'following',
                  label: CYBER_CONNECT
                }
              }
            ],
            [CONNECTION_ADDRESS_B]: [
              {
                link: CONNECTION_LINK,
                payload: {},
                type: {
                  description: 'followed',
                  label: CYBER_CONNECT
                }
              }
            ],
            [CONNECTION_ADDRESS_C]: [
              {
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
            ]
          }
        }
      );
    });

  });


});