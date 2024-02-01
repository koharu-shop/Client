'use client';
import ListBox from '@/components/common/ListBox';
import Header from '../../_component/ui/Header';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import { ListBox as IListBox } from '@/types/ListBox';
import { axiosInstance } from '@/lib/axios';
import Editor from '../_component/Editor';
import FileUpload from '../_component/FileUpload';
import TableWrap from '../../_component/ui/TableWrap';
import AddOption from './_component/AddOption';
import OptionList from './_component/OptionList';
import { Option } from './types/Option';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../../_component/common/Button';

interface FormData {
  name: string;
  count: string;
  price: string;
  sale: string;
  buyMinCount: string;
  buyMaxCount: string;
  type1: boolean;
  type2: boolean;
  type3: boolean;
  type4: boolean;
  displayOption: string;
}

export default function CreatePage() {
  const [category, setCategory] = useState<IListBox[]>([]);
  const [categorySelected, setCategorySelected] = useState<IListBox>(category[0]);
  const [options, setOptions] = useState<Option[]>();
  const [optionsSubject, setOptionsSubject] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      count: '',
      price: '',
      sale: '',
      buyMinCount: '0',
      buyMaxCount: '0',
      type1: false,
      type2: false,
      type3: false,
      type4: false,
      displayOption: 'Y',
    },
  });

  useEffect(() => {
    const getCategory = async () => {
      const response = await axiosInstance.get('/product/category');
      const data = response.data;
      setCategory(data);
      setCategorySelected(data[0]);
    };
    getCategory();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async data => {
    console.log(data);
    const productData = {
      ...data,
      categoryId: categorySelected.id,
      optionSubject: optionsSubject,
      content: 'hihi',
      img1: 'hihi',
      seoTitle: data.name,
    };
    const newProduct = await axiosInstance.post('/admin/product', productData);

    console.log(newProduct);

    // const productOptionData = {
    //   productId: newProduct.id,
    //   ...options,
    // };
    // await axiosInstance.post('/admin/productOption');

    // console.log(res);
  };

  return (
    <div>
      <Header>
        <h2 className="admin-h2">상품 등록</h2>
      </Header>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableWrap>
            <h2 className="p-2 font-semibold">기본 정보</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>상품 유형</th>
                    <td>
                      <div className="input_wrap">
                        <div className="checkbox">
                          <input type="checkbox" id="type1" {...register('type1')} />
                          <label htmlFor="type1">추천 상품</label>
                        </div>
                        <div className="checkbox">
                          <input type="checkbox" id="type2" {...register('type2')} />
                          <label htmlFor="type2">신상품</label>
                        </div>
                        <div className="checkbox">
                          <input type="checkbox" id="type3" {...register('type3')} />
                          <label htmlFor="type3">인기 상품</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>진열 상태</th>
                    <td>
                      <div className="input_wrap">
                        <div className="radio">
                          <input
                            type="radio"
                            value="Y"
                            id="displayOption1"
                            {...register('displayOption')}
                            checked={watch('displayOption') === 'Y'}
                          />
                          <label htmlFor="displayOption1">진열함</label>
                        </div>
                        <div className="radio">
                          <input
                            type="radio"
                            value="N"
                            id="displayOption2"
                            {...register('displayOption')}
                            checked={watch('displayOption') === 'N'}
                          />
                          <label htmlFor="displayOption2">진열안함</label>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>상품명</th>
                    <td>
                      <input type="text" required {...register('name', { required: true })} />
                      {errors.name && <p className="error">상품명은 필수값입니다.</p>}
                    </td>
                  </tr>
                  <tr>
                    <th>카테고리 선택</th>
                    <td>
                      {categorySelected && (
                        <div className="w-40">
                          <ListBox data={category} selected={categorySelected} setSelected={setCategorySelected} />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>상세 설명</th>
                    <td>
                      <Editor />
                    </td>
                  </tr>
                  <tr>
                    <th>대표 이미지</th>
                    <td>
                      <div>
                        <FileUpload />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TableWrap>
          <TableWrap>
            <h2>판매 정보</h2>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>할인 여부</th>
                    <td>
                      <div className="checkbox">
                        <input type="checkbox" id="type4" {...register('type4')} />
                        <label htmlFor="type4">할인</label>
                      </div>
                    </td>
                  </tr>
                  {watch('type4') === true && (
                    <tr>
                      <th>원가</th>
                      <td>
                        <input
                          type="text"
                          required
                          {...register('price', {
                            required: 'This field is required',
                            pattern: {
                              value: /^[0-9]+$/,
                              message: '숫자만 입력해주세요.',
                            },
                          })}
                        />
                        {errors.price && <p className="error">원가는 필수값입니다.</p>}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <th>판매가</th>
                    <td>
                      <input
                        type="text"
                        required
                        {...register('sale', {
                          required: 'This field is required',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: '숫자만 입력해주세요.',
                          },
                        })}
                      />
                      {errors.sale && <p className="error">판매가는 필수값입니다.</p>}
                    </td>
                  </tr>
                  <tr>
                    <th>재고</th>
                    <td>
                      <input
                        type="text"
                        required
                        {...register('count', {
                          required: 'This field is required',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: '숫자만 입력해주세요.',
                          },
                        })}
                      />
                      {errors.count && <p className="error">재고는 필수값입니다.</p>}
                    </td>
                  </tr>
                  <tr>
                    <th>최소 구매 수량</th>
                    <td>
                      <input
                        type="text"
                        {...register('buyMinCount', {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: '숫자만 입력해주세요.',
                          },
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>최대 구매 수량</th>
                    <td>
                      <input
                        type="text"
                        {...register('buyMaxCount', {
                          pattern: {
                            value: /^[0-9]+$/,
                            message: '숫자만 입력해주세요.',
                          },
                        })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>상품 선택 옵션</th>
                    <td>
                      <div className="text-slate-500">
                        <p>옵션항목은 콤마(,) 로 구분하여 여러개를 입력할 수 있습니다.</p>
                        <p>
                          예시) 옷을 예로 들어 [옵션1 : 사이즈 , 옵션1 항목 : XXL,XL,L,M,S] , [옵션2 : 색상 , 옵션2 항목
                          : 빨,파,노]
                        </p>
                      </div>
                      <AddOption setOptions={setOptions} setOptionsSubject={setOptionsSubject} />
                      <div className="mt-3">{options && <OptionList options={options} setOptions={setOptions} />}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TableWrap>
          <Button type="submit">전송</Button>
        </form>
      </main>
    </div>
  );
}
