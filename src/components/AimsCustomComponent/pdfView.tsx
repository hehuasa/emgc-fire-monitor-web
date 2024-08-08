import React, { useCallback, useState } from 'react';
import { request } from '@/utils/request';
import { useMount } from 'ahooks';
import { Box, Spinner } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const MyDocument = ({ data }: any) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfInfo, setPdfInfo] = useState<string | ArrayBuffer | null>();

  console.log('文件地址', data.planFileAddr);
  const fileStream = async () => {
    const res: any = await request({
      url: `/ms-plan/alarmPlanEntity/allFilePreviewByUrl?planFileAddr=${data.planFileAddr}`,
      options: {
        headers: {
          type: 'blob',
        },
      },
    });
    console.log('res', res);
    setPdfInfo(res);
  };
  const onDocumentLoadSuccess: any = useCallback(({ numPages }: { numPages: number }) => {
    setPageNumber(numPages);
  }, []);

  useMount(() => {
    fileStream();
  });

  return (
    <Document file={pdfInfo} onLoadSuccess={onDocumentLoadSuccess} error={<Box textAlign={'center'}>加载失败</Box>} loading={<Spinner />}>
      <Page pageNumber={pageNumber || 1}></Page>
    </Document>
  );
};

export default MyDocument;
