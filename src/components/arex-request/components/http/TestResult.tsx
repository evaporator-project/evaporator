import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { List, Progress } from 'antd';
import { FC } from 'react';

import { HoppTestResult } from '../../helpers/types/HoppTestResult';

const TestResult: FC<{ testResult: HoppTestResult }> = ({ testResult }) => {
  return (
    <div>
      {testResult.tests.length > 0 ? (
        testResult.tests.map((e: any, i: any) => (
          <List
            key={i}
            size="large"
            css={css`
              margin-bottom: 10px;
            `}
            header={
              <div>
                <div
                  css={css`
                    margin-top: -10px;
                    font-weight: bold;
                  `}
                >
                  {e.descriptor}
                </div>
                <div
                  css={css`
                    margin-top: 10px;
                    display: flex;
                  `}
                >
                  <Progress
                    strokeColor={'#EF4444'}
                    width={20}
                    strokeWidth={20}
                    percent={100}
                    success={{
                      percent: Math.round(
                        (e.expectResults.filter((i: any) => i.status === 'pass')
                          .length /
                          e.expectResults.length) *
                          100
                      ),
                      strokeColor: '#10B981',
                    }}
                    type="circle"
                    showInfo={false}
                  />
                  <span
                    css={css`
                      margin-left: 10px;
                      display: flex;
                    `}
                  >
                    {e.expectResults.length -
                    e.expectResults.filter((i: any) => i.status === 'pass')
                      .length ? (
                      <span
                        css={css`
                          color: #ef4444;
                        `}
                      >
                        {e.expectResults.length -
                          e.expectResults.filter(
                            (i: any) => i.status === 'pass'
                          ).length}{' '}
                        failing,{' '}
                      </span>
                    ) : (
                      <div></div>
                    )}
                    {e.expectResults.filter((i: any) => i.status === 'pass')
                      .length ? (
                      <span
                        css={css`
                          color: #10b981;
                        `}
                      >
                        {
                          e.expectResults.filter(
                            (i: any) => i.status === 'pass'
                          ).length
                        }{' '}
                        successful,{' '}
                      </span>
                    ) : (
                      <div></div>
                    )}
                    out of {e.expectResults.length} tests
                  </span>
                </div>
              </div>
            }
            bordered
            dataSource={e.expectResults}
            renderItem={(item: any, i) => (
              <List.Item key={i}>
                {item.status == 'pass' ? (
                  <CheckOutlined
                    css={css`
                      color: #10b981;
                      margin-right: 15px;
                    `}
                  />
                ) : (
                  <CloseOutlined
                    css={css`
                      color: #ef4444;
                      margin-right: 15px;
                    `}
                  />
                )}
                {item.message}——
                {item.status == 'pass' ? 'testPassed' : 'testFailed'}
              </List.Item>
            )}
          />
        ))
      ) : (
        <div>kong</div>
      )}
    </div>
  );
};

export default TestResult;
