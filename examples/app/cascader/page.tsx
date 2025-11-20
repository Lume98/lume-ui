'use client';

import { useState } from 'react';
import { Cascader, CascaderOption } from '@lume-ui/cascader';
import '@lume-ui/cascader/styles.css';

const options: CascaderOption[] = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '上城区', value: 'shangcheng' },
          { label: '滨江区', value: 'binjiang' },
        ],
      },
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' },
        ],
      },
      {
        label: '温州市',
        value: 'wenzhou',
        children: [
          { label: '鹿城区', value: 'lucheng' },
          { label: '龙湾区', value: 'longwan' },
        ],
      },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      {
        label: '南京市',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '秦淮区', value: 'qinhuai' },
          { label: '建邺区', value: 'jianye' },
        ],
      },
      {
        label: '苏州市',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '吴中区', value: 'wuzhong' },
          { label: '相城区', value: 'xiangcheng' },
        ],
      },
    ],
  },
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
        children: [
          { label: '天河区', value: 'tianhe' },
          { label: '越秀区', value: 'yuexiu' },
          { label: '海珠区', value: 'haizhu' },
        ],
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        children: [
          { label: '南山区', value: 'nanshan' },
          { label: '福田区', value: 'futian' },
          { label: '罗湖区', value: 'luohu' },
        ],
      },
    ],
  },
];

const fruitOptions: CascaderOption[] = [
  {
    label: '水果',
    value: 'fruits',
    children: [
      {
        label: '柑橘类',
        value: 'citrus',
        children: [
          { label: '橙子', value: 'orange' },
          { label: '柠檬', value: 'lemon' },
          { label: '柚子', value: 'grapefruit' },
        ],
      },
      {
        label: '浆果类',
        value: 'berries',
        children: [
          { label: '草莓', value: 'strawberry' },
          { label: '蓝莓', value: 'blueberry' },
          { label: '树莓', value: 'raspberry' },
        ],
      },
      {
        label: '热带水果',
        value: 'tropical',
        children: [
          { label: '芒果', value: 'mango' },
          { label: '菠萝', value: 'pineapple' },
          { label: '火龙果', value: 'dragonfruit' },
        ],
      },
    ],
  },
  {
    label: '蔬菜',
    value: 'vegetables',
    children: [
      {
        label: '叶菜类',
        value: 'leafy',
        children: [
          { label: '生菜', value: 'lettuce' },
          { label: '菠菜', value: 'spinach' },
          { label: '白菜', value: 'cabbage' },
        ],
      },
      {
        label: '根茎类',
        value: 'root',
        children: [
          { label: '萝卜', value: 'radish' },
          { label: '土豆', value: 'potato' },
          { label: '红薯', value: 'sweetpotato' },
        ],
      },
    ],
  },
];

export default function Page() {
  const [value1, setValue1] = useState<string[]>([]);
  const [value2, setValue2] = useState<string[]>([]);
  const [value3, setValue3] = useState<string[][]>([]);
  const [value4, setValue4] = useState<string[][]>([]);
  const [value5, setValue5] = useState<string[][]>([]);
  const [value6, setValue6] = useState<string[][]>([]);
  const [value7, setValue7] = useState<string>('');
  const [value8, setValue8] = useState<string[]>([]);
  const [value9, setValue9] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Cascader 级联选择器</h1>
        <p className="text-muted-foregrou nd">
          基于 shadcn UI
          构建的级联选择组件，支持单选、多选、父子关联和父子不关联等多种模式
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">单选模式</h2>
            <p className="text-sm text-muted-foreground">
              数据为空
            </p>
          </div>
          <Cascader
            options={[]}
            value={value1}
            placeholder="请选择地区"
            className="w-[400px]"
          />
        </div>

        {/* 示例 1: 单选模式 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">单选模式</h2>
            <p className="text-sm text-muted-foreground">
              只能选择一个叶子节点
            </p>
          </div>
          <Cascader
            options={options}
            value={value1}
            onChange={(values, selectedOptions) => {
              setValue1(values as string[]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择地区"
            className="w-[400px]"
          />
          {value1.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                值: {value1.join(' / ')}
              </p>
            </div>
          )}
        </div>

        {/* 示例 2: 多选 - 父子关联 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">多选模式 - 父子关联</h2>
            <p className="text-sm text-muted-foreground">
              选中父节点会自动选中所有子节点，取消父节点会自动取消所有子节点
            </p>
          </div>
          <Cascader
            options={options}
            value={value3}
            showCheckedStrategy="parent"
            onChange={(values, selectedOptions) => {
              setValue3(values as string[][]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择地区"
            className="w-[500px]"
            multiple
          />
          {value3.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                共选中 {value3.length} 个选项
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {value3.map((path, i) => (
                  <div key={i}>{path.join(' / ')}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 示例 3: 多选 - 父子不关联 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              多选模式 - 父子不关联
            </h2>
            <p className="text-sm text-muted-foreground">
              父节点和子节点可以独立选择，互不影响
            </p>
          </div>
          <Cascader
            options={fruitOptions}
            value={value4}
            onChange={(values, selectedOptions) => {
              setValue4(values as string[][]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择食品类别"
            className="w-[500px]"
            multiple
            checkStrictly
          />
          {value4.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                共选中 {value4.length} 个选项
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {value4.map((path, i) => (
                  <div key={i}>{path.join(' / ')}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 示例 4: 多选 - 限制标签数量 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              多选模式 - 限制标签数量
            </h2>
            <p className="text-sm text-muted-foreground">
              最多显示 3 个标签，剩余的显示为 +N
            </p>
          </div>
          <Cascader
            options={options}
            value={value5}
            onChange={(values, selectedOptions) => {
              setValue5(values as string[][]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择多个地区"
            className="w-[500px]"
            multiple
            checkStrictly
            maxTagCount={3}
          />
          {value5.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                共选中 {value5.length} 个选项
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {value5.map((path, i) => (
                  <div key={i}>{path.join(' / ')}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 示例 5: 多选 - 自定义剩余标签显示 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              多选模式 - 自定义剩余标签显示
            </h2>
            <p className="text-sm text-muted-foreground">
              最多显示 2 个标签，自定义剩余标签的显示方式
            </p>
          </div>
          <Cascader
            options={fruitOptions}
            value={value6}
            onChange={(values, selectedOptions) => {
              setValue6(values as string[][]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择食品"
            className="w-[500px]"
            multiple
            checkStrictly
            maxTagCount={2}
            maxTagPlaceholder={omittedCount => (
              <span className="text-xs">还有 {omittedCount} 项</span>
            )}
          />
          {value6.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                共选中 {value6.length} 个选项
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {value6.map((path, i) => (
                  <div key={i}>{path.join(' / ')}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 示例 6: 单选 - 食品分类 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">单选模式 - 食品分类</h2>
            <p className="text-sm text-muted-foreground">
              选择水果或蔬菜的具体类型
            </p>
          </div>
          <Cascader
            options={fruitOptions}
            value={value2}
            onChange={(values, selectedOptions) => {
              setValue2(values as string[]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择食品类别"
            className="w-[400px]"
          />
          {value2.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                值: {value2.join(' / ')}
              </p>
            </div>
          )}
        </div>

        {/* 示例 7: 单选 - 选择任意层级 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              单选模式 - 选择任意层级
            </h2>
            <p className="text-sm text-muted-foreground">
              设置 checkStrictly=true，可以选择父节点或子节点
            </p>
          </div>
          <Cascader
            options={options}
            value={value9}
            onChange={(values, selectedOptions) => {
              setValue9(values as string[]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择任意层级"
            className="w-[400px]"
            checkStrictly
          />
          {value9.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                值: {value9.join(' / ')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                注意：可以选择任意层级的节点，包括父节点
              </p>
            </div>
          )}
        </div>

        {/* 示例 8: 单选 - 仅返回最后节点值 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              单选模式 - 仅返回最后节点值
            </h2>
            <p className="text-sm text-muted-foreground">
              设置 showFullPath=false，value 只返回叶子节点的值
            </p>
          </div>
          <Cascader
            options={options}
            value={value7}
            onChange={(values, selectedOptions) => {
              setValue7(values as string);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择地区"
            className="w-[400px]"
            showFullPath={false}
          />
          {value7 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">值: {value7}</p>
              <p className="text-xs text-muted-foreground mt-1">
                注意：只返回最后一个节点的值
              </p>
            </div>
          )}
        </div>

        {/* 示例 9: 多选 - 仅返回最后节点值 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              多选模式 - 仅返回最后节点值
            </h2>
            <p className="text-sm text-muted-foreground">
              设置 showFullPath=false，value 返回所有叶子节点的值数组
            </p>
          </div>
          <Cascader
            options={fruitOptions}
            value={value8}
            onChange={(values, selectedOptions) => {
              setValue8(values as string[]);
              console.log('选中的值:', values);
              console.log('选中的选项:', selectedOptions);
            }}
            placeholder="请选择食品"
            className="w-[500px]"
            multiple
            checkStrictly
            showFullPath={false}
            maxTagCount={3}
          />
          {value8.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">当前选择:</p>
              <p className="text-sm text-muted-foreground">
                值数组: [{value8.join(', ')}]
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                注意：只返回叶子节点值的数组，不包含路径信息
              </p>
            </div>
          )}
        </div>

        {/* 示例 10: 禁用状态 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">禁用状态</h2>
            <p className="text-sm text-muted-foreground">禁用的级联选择器</p>
          </div>
          <Cascader
            options={options}
            value={['zhejiang', 'hangzhou', 'xihu']}
            disabled
            placeholder="请选择地区"
            className="w-[400px]"
          />
        </div>
      </div>

      {/* 特性说明 */}
      <div className="mt-12 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">组件特性</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">基础特性</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ 支持多级联动选择</li>
              <li>✅ 鼠标悬停展开子菜单</li>
              <li>✅ 支持禁用状态</li>
              <li>✅ 支持自定义宽度</li>
              <li>✅ 响应式设计，自适应内容宽度</li>
              <li>✅ 基于 shadcn UI 组件构建</li>
              <li>✅ 完整的 TypeScript 类型支持</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3">高级特性</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ 支持单选和多选模式</li>
              <li>✅ 多选模式下支持父子关联</li>
              <li>✅ 多选模式下支持父子不关联</li>
              <li>✅ 多选显示为标签（Badges）</li>
              <li>✅ 支持点击标签删除选项</li>
              <li>✅ 父子关联模式支持半选状态</li>
              <li>✅ 灵活的值格式和回调参数</li>
              <li>✅ 支持限制显示标签数量</li>
              <li>✅ 支持自定义剩余标签显示</li>
              <li>✅ 支持返回完整路径或仅叶子节点值</li>
              <li>✅ 单选模式支持选择任意层级节点</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium mb-2 text-sm">API 说明</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">multiple</code>:
              是否多选（默认 false）
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">
                checkStrictly
              </code>
              : 父子不关联（默认 false）
              <ul className="ml-4 mt-1 text-xs">
                <li>• 多选模式：父子节点独立选择</li>
                <li>• 单选模式：可选择任意层级节点</li>
              </ul>
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">value</code>:
              单选为 string[]，多选为 string[][]
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">onChange</code>:
              回调函数，返回选中的值和选项
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">maxTagCount</code>:
              最多显示的标签数量（多选模式）
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">
                maxTagPlaceholder
              </code>
              : 自定义剩余标签显示函数
            </li>
            <li>
              <code className="bg-muted px-1 py-0.5 rounded">showFullPath</code>
              : 是否返回完整路径（默认 true），false 时只返回叶子节点值
            </li>
          </ul>
          <div className="mt-3 p-3 bg-muted/30 rounded text-xs text-muted-foreground">
            <p className="font-medium mb-1">showFullPath 说明：</p>
            <ul className="space-y-1 ml-4">
              <li>• true（默认）：单选返回 string[]，多选返回 string[][]</li>
              <li>• false：单选返回 string，多选返回 string[]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
