'use client';

import { useState } from 'react';
import { Cascader, CascaderOption } from '@lume-ui/cascader';
import '@lume-ui/cascader/index.css';

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
  const [value3, setValue3] = useState<string[][]>([]);

  return (
    <div className="container mx-auto p-8 space-y-8">
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
